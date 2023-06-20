import {Object} from 'fabric/fabric-impl';

export default interface FabricNode {

    id: string;

    component: (option?: any) => Object;

    icon: string

}