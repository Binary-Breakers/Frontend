import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Input } from "@/components/ui/input";
import "./globals.css";
import DropDown from "@/components/custom/dropdown";
import Dropfile from "@/components/custom/drop-file";
import VulnType from "@/components/custom/vuln-type";
import VariantType from "@/components/custom/variant-type";
import CompileType from "@/components/custom/compile-type";

export default async function Index() {
	return (
		<>
			<h1 className="text-4xl text-center">TITLE A LA BA SA QA NA TA</h1>
			<div className="w-full flex justify-center items-center gap-10">
				<div className="w-3/12">
					<VariantType></VariantType>
				</div>
				<div className="w-1/2">
					<VulnType></VulnType>
				</div>
				<div className="w-3/12">
					<DropDown label="Platform" array={["Windows", "Linux"]} className="w-full"></DropDown>
				</div>
			</div>
			<div>
				<CompileType></CompileType>
			</div>
			<Dropfile></Dropfile>
		</>
	);
}
