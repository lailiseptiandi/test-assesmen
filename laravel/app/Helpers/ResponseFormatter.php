<?php

namespace App\Helpers;

class ResponseFormatter
{
    protected static $response = [
        'meta' => [
            'code' => 200,
            'status' => 'success',
            'message' => null,
        ],
        'data' => null,
    ];

    /**
     * Success response format
     */
    public static function success($data = null, $message = null, $code = 200)
    {
        self::$response['meta']['code'] = $code;
        self::$response['meta']['status'] = 'success';
        self::$response['meta']['message'] = $message;
        self::$response['data'] = $data;

        return response()->json(self::$response, $code);
    }

    /**
     * Error response format
     */
    public static function error($message = null, $code = 400, $data = null)
    {
        self::$response['meta']['code'] = $code;
        self::$response['meta']['status'] = 'error';
        self::$response['meta']['message'] = $message;
        self::$response['data'] = $data;

        return response()->json(self::$response, $code);
    }
}
