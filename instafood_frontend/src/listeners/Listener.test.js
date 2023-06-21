import Listener from "./ListenerClass";
import { getDoc } from "firebase/firestore";

jest.mock("firebase/firestore", () => {
    return {
        onSnapshot: jest.fn(),
        getDoc: jest.fn(),
        doc: jest.fn(),
    }
});

describe("Listener", () => {
    let listener;
    const mockRef = "mockRef";

    beforeEach(() => {
        listener = new Listener(mockRef);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("startSnapshotListener", () => {

        it("should throw an error if the document does not exist", async () => {
            getDoc.mockReturnValueOnce({ exists: () => false });
            await expect(listener.startSnapshotListener()).rejects.toThrowError();
        });

        it("should set the document property to the document data", async () => {
            getDoc.mockReturnValueOnce({ exists: () => true, data: () => "mockData" });
            await listener.startSnapshotListener();
            expect(listener.document).toBe("mockData");
        });

    });

    describe("getCurrentDocument", () => {

        it("should return the current document", () => {
            listener.document = "mockDocument";
            expect(listener.getCurrentDocument()).toBe("mockDocument");
        });

    });

    describe("subscribeToField", () => {

        it("should call the callback with the current value", () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            listener.subscribeToField("mockField", mockCallback);
            expect(mockCallback).toHaveBeenCalledWith("mockValue");
        });

        it("should return undefined if the field does not exist", () => {
            listener.document = {};
            const mockCallback = jest.fn();
            listener.subscribeToField("mockField", mockCallback);
            expect(mockCallback).toHaveBeenCalledWith(undefined);
        });

        it("should not add callback to the list of callbacks if the field does not exist", () => {
            listener.document = {};
            const mockCallback = jest.fn();
            listener.subscribeToField("mockField", mockCallback);
            expect(listener.fieldSubscriptions["mockField"]).toBeUndefined();
        });

        it("should add the callback to the list of callbacks for the field", () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            listener.subscribeToField("mockField", mockCallback);
            expect(listener.fieldSubscriptions["mockField"]).toContain(mockCallback);
        });

        it("should return a function that unsubscribes the callback", () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            const unsubscribe = listener.subscribeToField("mockField", mockCallback);
            unsubscribe();
            expect(listener.fieldSubscriptions["mockField"]).not.toContain(mockCallback);
        });

    });

    describe("_notifySubscribers", () => {

        it("should call the callbacks for the field", () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            listener.fieldSubscriptions["mockField"] = [mockCallback];
            listener._notifySubscribers();
            expect(mockCallback).toHaveBeenCalledWith("mockValue");
        });

    });

    describe("_unsubscribeFromField", () => {

        it("should remove the callback from the list of callbacks for the field", () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            listener.fieldSubscriptions["mockField"] = [mockCallback];
            listener._unsubscribeFromField("mockField", mockCallback);
            expect(listener.fieldSubscriptions["mockField"]).not.toContain(mockCallback);
        });

    });

    describe("Integration tests", () => {

        it("subscribeToField should return a function that unsubscribes the callback", async () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            const unsubscribe = listener.subscribeToField("mockField", mockCallback);
            unsubscribe();
            expect(listener.fieldSubscriptions["mockField"]).not.toContain(mockCallback);
        });

        it("should call the callback with the new value when the document changes", async () => {
            listener.document = { mockField: "mockValue" };
            const mockCallback = jest.fn();
            listener.subscribeToField("mockField", mockCallback);
            listener.document = { mockField: "mockValue2" };
            listener._notifySubscribers();
            expect(mockCallback).toHaveBeenCalledWith("mockValue2");
        });

    });

});

