import { Vector2, Vector3 } from 'alt-shared';

export function distance(vector1: Vector3, vector2: Vector3) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(
        Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2) + Math.pow(vector1.z - vector2.z, 2)
    );
}

export function distance2d(vector1: Vector2, vector2: Vector2) {
    if (vector1 === undefined || vector2 === undefined) {
        throw new Error('AddVector => vector1 or vector2 is undefined');
    }

    return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
}

export function getClosestVector(pos: Vector3, arrayOfPositions: Vector3[]) {
    arrayOfPositions.sort((a, b) => {
        return distance(pos, a) - distance(pos, b);
    });

    return arrayOfPositions[0];
}

export function lerp(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
}

export function vectorLerp(vector1: Vector3, vector2: Vector3, l: number, clamp: boolean) {
    if (clamp) {
        if (l < 0.0) {
            l = 0.0;
        }

        if (l > 0.0) {
            l = 1.0;
        }
    }

    let x = lerp(vector1.x, vector2.x, l);
    let y = lerp(vector1.y, vector2.y, l);
    let z = lerp(vector1.z, vector2.z, l);

    return { x: x, y: y, z: z };
}
