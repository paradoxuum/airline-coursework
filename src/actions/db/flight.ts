export class FlightData {
	private readonly departure_date: Date;
	private readonly arrival_date: Date;

	constructor(
		private readonly flight_id: number,
		private readonly flight_number: number,
		departure_date: string,
		arrival_date: string,
		private readonly airplane_id: number,
	) {
		this.departure_date = new Date(departure_date);
		this.arrival_date = new Date(arrival_date);
	}

	getFlightId() {
		return this.flight_id;
	}

	getFlightNumber() {
		return this.flight_number;
	}

	getDepartureDate() {
		return this.departure_date;
	}

	getArrivalDate() {
		return this.arrival_date;
	}

	getAirplaneId() {
		return this.airplane_id;
	}
}
