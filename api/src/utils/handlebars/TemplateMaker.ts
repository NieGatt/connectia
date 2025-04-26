import { ItemplateDAta } from "../interfaces/ItemplateData";
import * as path from "node:path"
import * as fs from "node:fs"
import hbs from "handlebars"

export const templateMaker = (data: ItemplateDAta) => {
    const { template, token, name } = data
    const filePath = path.join(process.cwd(), "public", `HbsTemplates/${template}.hbs`);
    const file = fs.readFileSync(filePath, "utf-8");
    const html = hbs.compile(file);
    return html({ name, token })
}