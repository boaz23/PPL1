import { reduce } from "ramda";

/* Question 3 */
interface Ok<T> {
    tag: "Ok";
    value: T;
}

interface Failure {
    tag: "Failure";
    massage: string;
}

export type Result<T> = Ok<T> | Failure;

export const makeOk: <T>(value: T) => Result<T> = <T>(value: T): Result<T> => ({tag: "Ok",value: value});

export const isOk: <T>(x: Result<T>) => x is Ok<T> = <T>(x: Result<T>): x is Ok<T> => x.tag === "Ok";

export const makeFailure: <T>(massage: string) => Result<T> = <T>(massage: string): Result<T> => ({tag: "Failure",massage: massage});

export const isFailure: <T>(x: Result<T>) => x is Failure = <T>(x: Result<T>): x is Failure => x.tag === "Failure";

/* Question 4 */
export const bind: <T, U>(result: Result<T>, f: (x: T) => Result<U>) => Result<U>
    = <T,U>(result: Result<T>, f: (x: T) => Result<U>): Result<U> => {
    return isOk(result) ? f(result.value) : result;
};

/* Question 5 */
interface User {
    name: string;
    email: string;
    handle: string;
}

const validateName = (user: User): Result<User> =>
    user.name.length === 0 ? makeFailure("Name cannot be empty") :
    user.name === "Bananas" ? makeFailure("Bananas is not a name") :
    makeOk(user);

const validateEmail = (user: User): Result<User> =>
    user.email.length === 0 ? makeFailure("Email cannot be empty") :
    user.email.endsWith("bananas.com") ? makeFailure("Domain bananas.com is not allowed") :
    makeOk(user);

const validateHandle = (user: User): Result<User> =>
    user.handle.length === 0 ? makeFailure("Handle cannot be empty") :
    user.handle.startsWith("@") ? makeFailure("This isn't Twitter") :
    makeOk(user);

export const naiveValidateUser: (user : User) => Result<User>
    = (user : User) : Result<User> => {
    const validatename = validateName(user);
    const validateemail = validateEmail(user);
    const validatehandle = validateName(user);
    return isOk(validatename) ? isOk(validateemail) ? validatehandle : validateemail : validatename;
    }

export const monadicValidateUser: (user: User) => Result<User> = (user: User): Result<User> =>
    reduce(bind, makeOk(user), [validateName, validateEmail, validateHandle])