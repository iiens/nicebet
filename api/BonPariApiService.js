"use strict";
const BASE_URL = "http://localhost:3000";
class BonPariAPI {
    static async getAllGames() {
        return fetch(BASE_URL + "/parties", { method: "GET" })
            .then(r => r.json())
            .then(r => {
            // @ts-ignore
            return r.map(MatchSummary.parse);
        });
    }
    // @ts-ignore
    static getGame(id) {
        return fetch(BASE_URL + "/parties/" + id, { method: "GET" })
            .then(r => r.json())
            .then(r => {
            // @ts-ignore
            return Match.parse(r);
        });
    }
    static bet(body) {
        throw new Error("Not implemented yet");
    }
}
