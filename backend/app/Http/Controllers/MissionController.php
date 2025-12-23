<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use Illuminate\Http\Request;
use App\Events\MissionCreated;
class MissionController extends Controller
{
    public function index()
    {
        $missions = Mission::join('users as creaters', 'missions.created_by', '=', 'creaters.id')
            ->leftJoin('users as assignees', 'missions.assigned_to', '=', 'assignees.id')
            ->select(
                'missions.*',
                'creaters.name as creator_name',
                'assignees.name as assignee_name'
            )->where('missions.status', '=', 'PUBLISHED')
            ->get();
        return response()->json($missions);
    }


    public function myMissions()
    {
        $userId = auth()->id();
        $missions = Mission::where('created_by', $userId)
            ->orWhere('assigned_to', $userId)
            ->get();
        return response()->json($missions);
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'from' => 'required|string|max:255',
            'to' => 'required|string|max:255',
            'when' => 'required|date',
            'distance' => 'required|numeric'
        ]);

        $data['created_by'] = auth()->id();
        $mission = Mission::create($data);
        return response()->json($mission, 201);
    }

    public function show(Mission $mission)
    {
        if (
            $mission->created_by === auth()->id() ||
            $mission->assigned_to === auth()->id() ||
            auth()->user()->role === 'operator' ||
            $mission->status === 'PUBLISHED'
        ) {
            $creator = $mission->createdBy()->first(['id', 'name', 'email']);
            $assignee = $mission->assignedTo()->first(['id', 'name', 'email']);
            return response()->json(
                [
                    'title' => $mission->title,
                    'description' => $mission->description,
                    'from' => $mission->from,
                    'to' => $mission->to,
                    'when' => $mission->when,
                    'distance' => $mission->distance,
                    'status' => $mission->status,
                    'assigned_to' => [
                        'id' => $assignee?->id,
                        'name' => $assignee?->name,
                        'email' => $assignee?->email,
                    ],
                    'created_by' => [
                        'id' => $creator->id,
                        'name' => $creator->name,
                        'email' => $creator->email,
                    ],
                ]
            );
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function accept(Request $request, int $id)
    {
        $data = $request->all();
        if (auth()->user()->role !== 'operator')
            return response()->json(['error' => 'Only operators can accept missions'], 403);

        $mission = Mission::find($id);

        if (!$mission)
            return response()->json(['error' => 'Mission not found'], 404);

        if ($mission->status !== 'PENDING')
            return response()->json(['error' => 'Mission not available for acceptance'], 400);

        $mission->status = $data['reason'] != null ? 'REJECTED' : 'PUBLISHED';
        $mission->rejection_reason = $data['reason'];
        $mission->save();
        event( $data['reason'] != null ? new \App\Events\MissionRejectedEvent($mission) : new \App\Events\MissionAcceptedEvent($mission));
        $creator = $mission->createdBy()->first(['id', 'name', 'email']);
        $assignee = $mission->assignedTo()->first(['id', 'name', 'email']);

        return response()->json(
            [
                'title' => $mission->title,
                'description' => $mission->description,
                'from' => $mission->from,
                'to' => $mission->to,
                'when' => $mission->when,
                'distance' => $mission->distance,
                'status' => $mission->status,
                'assigned_to' => [
                    'id' => $assignee?->id,
                    'name' => $assignee?->name,
                    'email' => $assignee?->email,
                ],
                'created_by' => [
                    'id' => $creator->id,
                    'name' => $creator->name,
                    'email' => $creator->email,
                ],
            ]
        );
    }

    public function getPended()
    {
        if (auth()->user()->role !== 'operator') {
            return response()->json(['error' => 'Only operators can view pended missions'], 403);
        }
        try {
            $missions = Mission::where('status', 'PENDING')->with('createdBy','assignedTo')->get();
            if ($missions->isEmpty()) {
                return response()->json([], 200);
            }
            return response()->json($missions, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'An error occurred while fetching pended missions'], 500);
        }
    }

    public function publish(Request $request, int $id)
    {
        $mission = Mission::find($id);
        if (!$mission)
            return response()->json(['error' => 'Mission not found'], 404);

        if (auth()->user()->role === 'operator') {
            $mission->status = 'PUBLISHED';
            $mission->save();
            return response()->json($mission);
        }

        if ($mission->created_by === auth()->id()) {
            $mission->status = 'PENDING';
            $mission->save();
            event(new \App\Events\MissionPendedEvent($mission));
            $creator = $mission->createdBy()->first(['id', 'name', 'email']);
            $assignee = $mission->assignedTo()->first(['id', 'name', 'email']);
            return response()->json(
                [
                    'title' => $mission->title,
                    'description' => $mission->description,
                    'from' => $mission->from,
                    'to' => $mission->to,
                    'when' => $mission->when,
                    'distance' => $mission->distance,
                    'status' => $mission->status,
                    'assigned_to' => [
                        'id' => $assignee?->id,
                        'name' => $assignee?->name,
                        'email' => $assignee?->email,
                    ],
                    'created_by' => [
                        'id' => $creator->id,
                        'name' => $creator->name,
                        'email' => $creator->email,
                    ],
                ]
            );
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function close(int $id)
    {
        $mission = Mission::find($id);
        if (!$mission)
            return response()->json(['error' => 'Mission not found'], 404);

        if ($mission->created_by === auth()->id() || $mission->assigned_to === auth()->id() || auth()->user()->role === 'operator') {
            $mission->status = 'CLOSED';
            $mission->save();
            return response()->json($mission);
        }

        return response()->json(['error' => 'Unauthorized'], 403);
    }

    public function destroy(int $id)
    {
        $mission = Mission::find($id);
        if (!$mission) {
            return response()->json(['error' => 'Mission not found'], 404);
        }
        if (auth()->user()->role === 'operator' || $mission->created_by === auth()->id()) {
            $mission->delete();
            return response()->json([], 204);
        }
        return response()->json(['error' => 'Unauthorized'], 403);
    }
}
