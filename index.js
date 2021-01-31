import "isomorphic-unfetch";
require("dotenv").config();
import express from "express";
import { join } from "path";

import { promises as fs } from "fs";

const app = express();

const Key = process.env.client_Id;

const countryData = async (country) => {
    let data = []
    const { confirmed, recovered, deaths, lastUpdate }  = await  fetch("https://covid19.mathdro.id/api/countries/"+ country).then((res) => res.json());
    data.push(confirmed['value'], recovered['value'], deaths['value'], lastUpdate)
    return data
}

const globalData = async () => {
    let data = []
    const { confirmed, recovered, deaths, lastUpdate }  = await  fetch("https://covid19.mathdro.id/api").then((res) => res.json());
    data.push(confirmed['value'], recovered['value'], deaths['value'], lastUpdate)
    return data
}

const main = async () => {

    const readmeTemplate = (
        await fs.readFile(join(process.cwd(), "./README.template.md"))
    ).toString("utf-8");

    const global = await globalData()

    const country= await countryData('Pakistan')

    const dateUp = new Date().toLocaleString()

    const readme = readmeTemplate
        .replace("{val-gc}", global[0])
        .replace("{val-gr}", global[1])
        .replace("{val-gd}", global[2])
        .replace("{val-glup}", global[3])
        .replace("{val-cc}", country[0])
        .replace("{val-cr}", country[1])
        .replace("{val-cd}", country[2])
        .replace("{val-clup}", country[3])
        .replace("{val-lv}", dateUp)

    await fs.writeFile("README.md", readme);

}
main()