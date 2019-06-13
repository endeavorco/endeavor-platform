export class BackendApiServiceMock{
    subscribeEmail(email, firstName = "empty", lastName = "empty", phone = ""): Promise<any>{
        return new Promise((resolve, reject) => resolve(true));
    }
}