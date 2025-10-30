<?php

namespace App\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $posts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('limit', 6));

        return ResponseFormatter::success($posts);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = [
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'content' => $request->content,
            'user_id' => auth()->id(),
        ];

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $data['thumbnail'] = asset('storage/' . $path);
        }

        $post = Post::create($data)->load('user');
        return ResponseFormatter::success($post, 'Post created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with('user')->find($id);
        if (!$post) {
            return ResponseFormatter::error(null, 'Post not found', 404);
        }

        return ResponseFormatter::success($post, 'Post retrieved successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return ResponseFormatter::error(null, 'Post not found', 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $post->title = $request->title;
        $post->slug = Str::slug($request->title);
        $post->content = $request->content;

        if ($request->hasFile('thumbnail')) {
            if ($post->thumbnail) {
                $oldPath = str_replace(asset('storage/'), '', $post->thumbnail);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('thumbnail')->store('thumbnails', 'public');
            $post->thumbnail = asset('storage/' . $path);
        }

        $post->save();

        return ResponseFormatter::success($post->load('user'), 'Post updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $post = Post::find($id);
        if (!$post) {
            return ResponseFormatter::error(null, 'Post not found', 404);
        }

        if ($post->thumbnail) {
            $oldPath = str_replace(asset('storage/'), '', $post->thumbnail);
            Storage::disk('public')->delete($oldPath);
        }

        $post->delete();

        return ResponseFormatter::success(null, 'Post deleted successfully');
    }
}
