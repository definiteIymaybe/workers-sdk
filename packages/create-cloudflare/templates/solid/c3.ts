import { logRaw, updateStatus } from "@cloudflare/cli";
import { blue, brandColor, dim } from "@cloudflare/cli/colors";
import { installPackages, runFrameworkGenerator } from "helpers/command";
import { compatDateFlag } from "helpers/files";
import { detectPackageManager } from "helpers/packages";
import type { TemplateConfig } from "../../src/templates";
import type { C3Context } from "types";

const { npm } = detectPackageManager();

const generate = async (ctx: C3Context) => {
	// Run the create-solid command
	await runFrameworkGenerator(ctx, [ctx.project.name]);

	logRaw("");
};

const config: TemplateConfig = {
	configVersion: 1,
	id: "solid",
	displayName: "Solid",
	platform: "pages",
	copyFiles: {
		js: { path: "./js" },
		ts: { path: "./ts" },
	},
	generate,
	transformPackageJson: async () => ({
		scripts: {
			"pages:preview": `${npm} run build && npx wrangler pages dev dist ${await compatDateFlag()} --compatibility-flag nodejs_compat`,
			"pages:deploy": `${npm} run build && wrangler pages deploy ./dist`,
		},
	}),
	devScript: "dev",
	compatibilityFlags: ["nodejs_compat"],
};
export default config;
