export interface User {
    first_name: string,
    group: string,
    id: number,
    last_name: string,
    photo?: string,
    username: string
}

export interface Trip {
    created: string,
    driver?: User | number,
    drop_off_address: string,
    id: string,
    pick_up_address: string,
    rider: User | number,
    status: string,
    updated: string
}

export interface CreateTrip {
    drop_off_address: string,
    pick_up_addresss: string,
    rider: number,
}

export interface Message {
    action: string,
    data: Trip,
    type: string,
}