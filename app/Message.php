<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $hidden = [
        'updated_at'
    ];
    protected $fillable = [
        'sender',
        'receiver',
        'text',
    ];
}
