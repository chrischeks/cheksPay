import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor() { }

    getUser() {
        const user = JSON.parse(localStorage.BaseUser)
        return user
    }

    getToken() {
        console.log(JSON.parse(localStorage.BaseUser), 'access');

        const accessToken = JSON.parse(localStorage.BaseUser).accessToken

        return accessToken
    }
}
