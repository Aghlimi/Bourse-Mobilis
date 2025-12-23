<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    /** @use HasFactory<\Database\Factories\MissionFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'from',
        'to',
        'when',
        'distance',
        'status',
        'assigned_to',
        'created_by',
    ];
    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function proposals()
    {
        return $this->hasMany(Proposal::class);
    }
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
