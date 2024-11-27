import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { Input } from "./../components/ui/input";
import "./globals.css";
import DropDown from "@/components/dropdown";
import Dropfile from "@/components/drop-file";

export default async function Index() {
	return (
		<>
			<h1 className="text-4xl text-center">TITLE A LA BA SA QA NA TA</h1>
			<div className="w-full flex justify-center items-center gap-10">
				<div className="w-3/12">
					Variants
					<Input className="w-full" type="number" min={1}></Input>
				</div>
				<div className="w-1/2">
					Vulnerability type
					<Input className="w-full"></Input>
				</div>
				<div className="w-3/12">
					<DropDown label="Platform" array={["Windows", "Linux"]} className="w-full"></DropDown>
				</div>
			</div>
			<div>
				Please add compile arguments
				<Input className="w-full" type="text" aria-label="Please add compile arguments"></Input>
			</div>
			<Dropfile></Dropfile>
		</>
	);
}
