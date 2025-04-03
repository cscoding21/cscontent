function isObjKey<T>(key: any, obj: any): key is keyof T {
	return key in obj;
}

/**
 * take in an object and re-shape it to conform to the passed in yup schema.  This mostly removes undefined fields
 * @param input any object
 * @param schema a yup schema
 * @returns an object that conforms to the passed schema
 */
// export function coalesceToType<T>(input: any, schema: ObjectSchema<Maybe<AnyObject>>): T {
// 	const out: T = <T>{};
// 	const describe = schema.describe();

// 	Object.keys(input).forEach((key) => {
// 		if (isObjKey<T>(key, describe.fields)) {
// 			out[key] = input[key];
// 		}
// 	});

// 	return out;
// }

/**
 * hold before calling a function
 * @param callback function to call
 * @param wait milliseconds to wait
 * @returns 
 */
export const debounce = (callback: Function, wait = 300) => {
    let timeout: ReturnType<typeof setTimeout>;

    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), wait);
    };
};
