/*
 * VERY basic custom Kaboom.js component. Can be attached onto a Kaboom "object"
 * and add features to that object such as giving it a unique ID.
 * 
 * When created, a UUID is built which is VERY important. That ID is used to link
 * the interface objects with their logical representations. Communication
 * between the interface and the logic backend will revolve around the synchronization
 * of the component IDs. (ie. viewComponent (id=1234) <==> logicComponent (id=1234))
 */

import k from '../kaboom.js';

import { BoundingRect, BoundRectTypes, BoundRectOrigins } from './boundingRect.js';

/**
 * Custom Kaboom component
 */
export default function InterfaceComponent(name, id, tags, center, w, h) {
    var id = id;
    var name = name;
    var tags = tags;
    var myBoundingBox = new BoundingRect(center, null, w, h, BoundRectTypes.VECT_CENTER, BoundRectOrigins.CENTER);
    var boundary;
    var myConnections = [];

    return {
        uuid() { // renamed to not override built-in id (uuid = Universally Unique Identifier  )
            return id;
        },
        name() { 
            return name; 
        },
        client() {
            return tags.includes('CLIENT');
        },
        endpoint() {
            return tags.includes('ENDPOINT');
        },
        processor() {
            return !this.client() && !this.endpoint();
        },
        equals(other) { 
            if (other instanceof InterfaceComponent) {
                return other.uuid() === id;
            } else {
                return false; // may be a troublesome default
            }
        },
        print() {
            console.log(`Component - Name: ${name}, ID: ${id}`);
        },
        setBoundaryBox(boundaryBox) {
            boundary = boundaryBox;
            myBoundingBox.setContainment(boundary);
        },
        getBoundingBox() {
            return myBoundingBox;
        },
        moveComponent(pos) {
            let newPos = myBoundingBox.move(pos);
            // console.log(pos, newPos);

            for (let c of myConnections) {
                c.moved(newPos, this);
            }

            this.pos = newPos;
        },
        connect(connection) {
            myConnections.push(connection);
        }
    };
};


