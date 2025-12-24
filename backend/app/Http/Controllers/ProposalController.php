<?php

namespace App\Http\Controllers;

use App\Models\Mission;
use App\Models\Proposal;
use Illuminate\Http\Request;

class ProposalController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, int $missionId)
    {
        $data = $request->validate([
            'proposed_price' => 'required|numeric',
            'message' => 'nullable|string',
        ]);

        $data['mission_id'] = $missionId;
        $data['user_id'] = auth()->id();

        $proposal = Proposal::create($data);
        event(new \App\Events\NewPropositionEvent($proposal));
        return response()->json($proposal, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Proposal $proposal)
    {
        if (
            $proposal->user_id === auth()->id() ||
            $proposal->mission->created_by === auth()->id() ||
            auth()->user()->role === 'operator'
        ) {
            return response()->json($proposal);
        } else {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
    }

    public function missionProposals($missionId)
    {
        $mission = Mission::findOrFail($missionId);
        if ($mission->created_by !== auth()->id() && auth()->user()->role !== 'operator') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        if($mission->status !== 'PUBLISHED')
        {
            return response()->json(['error' => 'Proposals can only be viewed for PUBLISHED missions'], 403);
        }
        $proposals = Proposal::where('mission_id', $missionId)
            ->with('user:id,name,email')
            ->get();

        return response()->json($proposals);
    }

    public function accept($proposalId)
    {
        $proposal = Proposal::findOrFail($proposalId);
        $mission = $proposal->mission;

        if ($mission->created_by !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        $mission->assigned_to = $proposal->user_id;
        $proposal->status = 'ACCEPTED';
        $mission->status = 'ASSIGNED';
        \DB::transaction(function () use ($proposal, $mission) {
            $proposal->save();
            $mission->save();
            event(new \App\Events\PropositionAcceptedEvent($proposal));
        });

        return response()->json(['message' => 'Proposal accepted and mission assigned.']);
    }

    public function reject($proposalId)
    {
        $proposal = Proposal::findOrFail($proposalId);
        $mission = $proposal->mission;

        if ($mission->created_by !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $proposal->status = 'REJECTED';
        $proposal->save();
        event(new \App\Events\PropositionRejectedEvent($proposal));
        return response()->json(['message' => 'Proposal rejected.']);
    }
}
