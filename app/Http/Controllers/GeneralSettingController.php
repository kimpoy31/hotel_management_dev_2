<?php

namespace App\Http\Controllers;

use App\Models\GeneralSetting;
use Illuminate\Http\Request;

class GeneralSettingController extends Controller
{
    public function overtime_charge_patch(Request $request){
        $setting = GeneralSetting::find(1);

        $setting->update([
            'overtime_charge' => $request->input('overtime_charge')
        ]);
    }
}
