import {HTTP} from "src/axios/index";

export default class IotaSeedService {

    async generateNewSeed() {
        return await HTTP().get("iota/generateSeed");
    }

    async getCurrentSeed() {
        return await HTTP().get("iota/getCurrentSeed");
    }

    async setCurrentSeed(_seed) {
        return await HTTP().post("iota/setCurrentSeed", {
            "seed": _seed.seed
        });
    }

    async getArchiveSeeds() {
        return await HTTP().get("iota/getArchiveSeeds");
    }

}