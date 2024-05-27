import { airplaneActions } from "@/actions/airplane";
import { flightActions } from "@/actions/flight";
import { passengerActions } from "@/actions/passenger";
import { staffActions } from "@/actions/staff";
import "reflect-metadata";

export const server = {
	airplane: airplaneActions,
	flight: flightActions,
	passenger: passengerActions,
	staff: staffActions,
};
