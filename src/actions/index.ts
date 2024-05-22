import { airplaneActions } from "@/actions/airplane";
import { flightActions } from "@/actions/flight";
import { staffActions } from "@/actions/staff";

export const server = {
	...airplaneActions,
	...flightActions,
	...staffActions,
};
