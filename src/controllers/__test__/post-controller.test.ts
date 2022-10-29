import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";

const createPost = async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const newPost = {
        title: "This is a awesome test case",
        body: "This is a awesome test case for testing",
        user: userId,
    };
    return await request(app).post("/api/posts").send(newPost);
};

describe.skip("Get All Post Test Suit", () => {
    test("can fetch list of posts", async () => {
        await createPost();
        await createPost();
        await createPost();

        const response = await request(app)
            .get("/api/posts")
            .send()
            .expect(200);
        expect(response.body.length).toEqual(3);
    });
});

describe.skip("Get Post By Post Id Test Suit", () => {
    test("return status 200 and length 1 if post has", async () => {
        await createPost();

        const postId = await (await createPost()).body.id;

        const response = await request(app)
            .get(`/api/posts/${postId}`)
            .send()
            .expect(200);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            title: "This is a awesome test case",
            body: "This is a awesome test case for testing",
        });
    });
    test("return status 404 if the post is not found", async () => {
        const postId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app).get(`/api/posts/${postId}`).send();

        expect(response.status).toBe(404);
    });
});

describe.skip("Get Post By User Id Test Suit", () => {
    test("return status 200 if post has", async () => {
        const postsResponse = await createPost();

        const response = await request(app)
            .get(`/api/posts/user/${postsResponse.body.user}`)
            .send();
        expect(response.status).toBe(200);
    });
    test("return status 404 if post not found by user", async () => {
        const userId = new mongoose.Types.ObjectId().toHexString();

        const response = await request(app)
            .get(`/api/posts/user/${userId}`)
            .send();

        expect(response.status).toBe(404);
    });
});

describe("Update Post Test Suit", () => {
    test.skip("return 200 if post is updated", async () => {
        const createNewPost = await createPost();
        const updatePostId = createNewPost.body.id;

        const updatedPost = {
            title: "Updated Post Good Test",
            body: "Updated Post Good Test for Body",
        };

        await request(app)
            .patch(`/api/posts/${updatePostId}`)
            .send(updatedPost)
            .expect(200);
    });
    test.skip("return 404 if post has not found", async () => {
        const postId = new mongoose.Types.ObjectId().toHexString();
        const updatedPost = {
            title: "Updated Post Good Test",
            body: "Updated Post Good Test for Body",
        };

        await request(app)
            .patch(`/api/posts/${postId}`)
            .send(updatedPost)
            .expect(404);
    });
    test("return error if invalid post data provided", async () => {
        const post = await createPost();
        const updatePostId = post.body.id;

        const updatedPost = {
            title: "",
            body: "Updated Post Good Test for Body",
        };

        try {
            await request(app)
                .patch(`/api/posts/${updatePostId}`)
                .send(updatedPost);
        } catch (error) {
            expect(error).toThrow();
        }
    });
});
