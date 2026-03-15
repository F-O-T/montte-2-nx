import { describe, expect, it, vi } from "vitest";

const { getSessionMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
}));

vi.mock("@core/auth", () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

import { createContext } from "../src/context";

describe("createContext", () => {
  it("loads the session from auth using the request headers", async () => {
    const req = new Request("https://example.com/api/rpc", {
      headers: {
        cookie: "session=abc",
      },
    });
    const session = {
      user: {
        id: "user_1",
      },
    };

    getSessionMock.mockResolvedValueOnce(session);

    const context = await createContext({ req });

    expect(getSessionMock).toHaveBeenCalledWith({
      headers: req.headers,
    });
    expect(context).toEqual({
      req,
      session,
    });
  });
});
