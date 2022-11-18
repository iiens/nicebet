"use strict";
const BASE_URL = "http://localhost:3000";
class ApiConnectionLostError {
    constructor(cachedData) {
        this.cachedData = cachedData;
    }
}
class BonPariAPI {
    static async fetchJson(r) {
        const json = await r.json();
        json['version'] = r.headers.get('Server-version');
        return json;
    }
    static async getAllGames() {
        return fetch(BASE_URL + "/parties", { method: "GET" })
            .then(BonPariAPI.fetchJson)
            .then(r => {
            localStorage.setItem(BonPariAPI.LIST_KEY, JSON.stringify(r));
            // @ts-ignore
            return r.map(MatchSummary.parse);
        }).catch(e => {
            const matchs = localStorage.getItem(BonPariAPI.LIST_KEY);
            if (matchs == null)
                throw new Error(e);
            throw new ApiConnectionLostError(JSON.parse(matchs).map(MatchSummary.parse));
        });
    }
    // @ts-ignore
    static getGame(id) {
        return fetch(BASE_URL + "/parties/" + id, { method: "GET" })
            .then(BonPariAPI.fetchJson)
            .then(r => {
            localStorage.setItem(BonPariAPI.MATCH_KEY + id, JSON.stringify(r));
            // @ts-ignore
            return Match.parse(r);
        }).catch(e => {
            const match = localStorage.getItem(BonPariAPI.MATCH_KEY + id);
            if (match == null)
                throw new Error(e);
            // @ts-ignore
            throw new ApiConnectionLostError(Match.parse(JSON.parse(match)));
        });
    }
    static bet(body) {
        return fetch("http://localhost:3000/parties/parier", {
            method: "POST",
            body: JSON.stringify(body.toAPIJson()),
            headers: { "Content-type": "application/json;charset=UTF-8" }
        })
            .then(BonPariAPI.fetchJson)
            .then(r => {
            return BetResult.parse(r);
        });
    }
}
BonPariAPI.LIST_KEY = 'l_matchs';
BonPariAPI.MATCH_KEY = 'l_match';
