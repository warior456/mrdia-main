"use strict";

const fs = require('fs').promises;
const path = require('path');

/**
 * Advanced class to read, write, delete, ... files based on `fs.promises`.
 * <br>
 * Features: async, extended logging, error rethrowing, data parsing, ...
 */
class File {

    /**
     * @throws {Error} - This is a utility class
     */
    constructor() {
        throw new Error("You can't initiate a utility class !!!");
    }

    /**
     * Asynchronously append data to a file, creating the file if it does not exist.
     * @param {string} link - The link to the file
     * @param {string} data - The data that needs to be written to the file
     * @returns {Promise<void>}
     */
    static async append(link, data) {
        try {
            await fs.appendFile(link, data);
        } catch (err) {
            const errData = { "link": link, "data": data, "error": err };
            console.error("Unable to append the supplied data to the file");
            console.log(errData);
            throw new Error("Unable to append the supplied data to the file");
        }
    }

    /**
     * Asynchonously copy a file to another location.
     * @param {string} link - The link to the file
     * @param {string} target - The location where the copy needs to be stored
     * @param {boolean} [force=false] - Indicate if you want to overwrite the target file if it exists
     * @returns {Promise<void>}
     */
    static async copy(link, target, force=false) {
        try {
            const fileExists = await this.exists(target);
            if(fileExists && !force) {
                throw new Error('File already exists');
            }
            await fs.copyFile(link, target);
        } catch (err) {
            const errData = { "link": link, "target": target, "error": err };
            console.error('Unable to copy file');
            console.log(errData);
            throw new Error('Unable to copy file');
        }
    }

    /**
     * Asynchronously delete a file.
     * @param {string} link - The link to the file
     * @returns {Promise<void>}
     */
    static async delete(link) {
        try {
            await fs.unlink(link);
        } catch (err) {
            const errData = { "link": link, "error": err };
            console.error('Unable to delete file');
            console.log(errData);
            throw new Error('Unable to delete file');
        }
    }

    /**
     * Asynchronously delete a file if it exists.
     * @param {string} link - The link to the file
     * @returns {Promise<void>}
     */
    static async deleteIfExists(link) {
        const exists = await this.exists(link);
        if(exists) {
            await this.delete(link);
        }
    }

    /**
     * Asynchronously check if a file exists.
     * @param {string} link - The link to the file
     * @returns {Promise<boolean>}
     */
    static async exists(link) {
        try {
            await fs.access(link);
            return (await fs.stat(link)).isFile();
        } catch (err) {
            if(err.code !== "ENOENT") {   // something else than the file that not exists
                const errData = { "link": link, "error": err };
                console.error("Unable to check if a file exists");
				console.log((errData), false);    // saving the log also depends on this function
                throw new Error("Unable to check if a file exists");
            }
            return false;
        }
    }

    /**
     * Asynchronously move a file from one place to another.
     * @param {string} oldLink - The link to the file
     * @param {string} newLink - The link to the place where you want the file to be
     * @param {boolean} [force=false] - Indicate if you want to overwrite the file if it already exists or not
     * @returns {Promise<void>}
     */
    static async move(oldLink, newLink, force=false) {
        try {
            if(!await this.exists(oldLink)) throw new Error("Source file doesn't exist");
            if(await this.exists(newLink) && force === false) throw new Error("Target file already exists");

            await fs.rename(oldLink, newLink);
        } catch (err) {
            const errData = { "oldLink": oldLink, "newLink": newLink, "error": err };
            console.error('Unable to move file');
            console.log(errData);
            throw new Error('Unable to move file');
        }
    }

    /**
     * Asynchronously read a file and return the parsed data.
     * @param {string} link - The link to the file
     * @returns {Promise<Object|String>}
     */
    static async read(link) {
        try {
            const data = await fs.readFile(link);
            return this.#parse(link, data);
        } catch (err) {
            const errData = { "link": link, "error": err };
            console.error('Unable to read file');
            console.log(errData);
            throw new Error('Unable to read file');
        }
    }

    /**
     * Asynchronously rename a file.
     * @param {string} link - The link to the file
     * @param {string} newName - The new name of the file
     * @returns {Promise<void>}
     */
    static async rename(link, newName) {
        const newLink = path.dirname(link) + "/" + newName;
        try {
            if(!await this.exists(link)) throw new Error("Source file doesn't exist");
            if(await this.exists(newLink)) throw new Error("Target file already exists");

            await this.move(link, newLink);
        } catch (err) {
            const errData = { 'link': link, 'newName': newName, 'newLink': newLink , 'error': err };
            console.error('Unable to rename file');
            console.log(errData);
            throw new Error('Unable to rename file');
        }
    }

    /**
     * Asynchronously save a file.
     * @param {string} link - The link to the file
     * @param {Object|string} data - The data that needs to be saved
     * @param {boolean} [force=false] - Indicate if you want to overwrite the file if it already exists or not
     * @returns {Promise<void>}
     */
    static async save(link, data, force=false) {
        try {
            const fileExists = await this.exists(link);
            if(fileExists && !force) {
                throw new Error('File already exists');
            }
            await fs.writeFile(link, this.#stringify(data));
        } catch (err) {
            const errData = { "link": link, "data": data, "error": err };
            console.error('Unable to save file');
            console.log(errData);
            throw new Error('Unable to save file');
        }
    }

    /**
     * Parse the raw data from a file.
     * @param {string} link - The link to the file to determine the data type
     * @param {Buffer} data - The buffered data from the file
     * @returns {Object|string}
     */
    static #parse(link, data) {
        if(path.extname(link) === ".json") {
            return JSON.parse(data);
        }
        return data.toString();     // data is still a buffer
    }

    /**
     * Stringify the data before saving it to a file.
     * @param {*} data - The data that has to be converted into a string
     * @returns {string}
     */
    static #stringify(data) {
        if(typeof data === "object") {
            return JSON.stringify(data, null, 4);
        }
        return data;
    }
}

module.exports = File;

// NOTES

/*
* Q: Why rethrowing ?
* A: This enables more specific errors.
*    E.g. you want to save a file but it is in use by the OS.
*    One error will be that the file is in use.
*    The other will be that something went wrong during the adding/removing of data that also had to be saved in the file.
*
* Q: Why do you need to await the fs.method() when nothing comes after it ?
* A: If you don't await the outcome of the fs.method(), any error that will be thrown won't be catched by the try/catch.
*    Tl;dr, the catch block will never be reached.
*/