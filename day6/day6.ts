import { count } from 'console';
import { getInputData } from '../common/helpers';

const inputData = getInputData()[0];
const startOfPacketMarkerLength = 4;
let startOfPacketMarkerIndex = 0;
const startOfMessageMarkerLength = 14;
let startOfMessageMarkerIndex = 0;
let index = 0;
let lastUniqueIndex = 0;
while (index < inputData.length) {
    let position = inputData.indexOf(inputData[index], lastUniqueIndex);
    if (position > -1 && position < index) {
        lastUniqueIndex = position + 1;
    }
    if (index - lastUniqueIndex + 1 == startOfPacketMarkerLength && startOfPacketMarkerIndex == 0) {
        startOfPacketMarkerIndex = index;
    }
    if (index - lastUniqueIndex + 1 == startOfMessageMarkerLength && startOfMessageMarkerIndex == 0) {
        startOfMessageMarkerIndex = index;
    }
    ++index;
}
console.log(`Found packet marker ${inputData.substring(startOfPacketMarkerIndex - startOfPacketMarkerLength + 1, startOfPacketMarkerIndex + 1)} after ${startOfPacketMarkerIndex + 1} characters.`);
console.log(`Found message marker ${inputData.substring(startOfMessageMarkerIndex - startOfMessageMarkerLength + 1, startOfMessageMarkerIndex + 1)} after ${startOfMessageMarkerIndex + 1} characters.`);