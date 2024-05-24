import { getPassengers } from "@/api/passenger";
import { client } from "@/stores/app";
import { useQuery } from "@tanstack/react-query";

export function PassengerTable() {
	const query = useQuery(
		{
			queryKey: ["passengers"],
			queryFn: getPassengers,
		},
		client,
	);
}
