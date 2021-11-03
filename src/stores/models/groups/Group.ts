import GroupTO from "src/services/group/types/GroupTO";
import GroupMembership from "@/stores/models/groups/GroupMembership";
import Product from "@/stores/models/Product";
import Payment from '../Payment';

export default class Group implements GroupTO {
    public id?: string;
    public title?: string;
    public description?: string;
    public groupMemberships?: GroupMembership[];
    public products?: Product[];
    public userMembership?: GroupMembership;
    public imageUrl?: string;
    public payments?: Payment[] = [];

    static fromTO(data: GroupTO) {
        let result = new Group();
        Object.assign(result, data);
        result.groupMemberships = GroupMembership.fromTOList(data.groupMemberships);
        result.products = Product.fromTOList(data.products);
        result.userMembership = GroupMembership.fromTO(data.userMembership);
        result.payments = Payment.fromTOList(data.payments);
        return result;
    }

    static fromTOList(data?: GroupTO[]): Group[] {
        if (data != undefined) {
            return data.map(it => Group.fromTO(it));
        }
        return [];
    }

    static fromTemplate() {
        let group = new Group();
        group.products = new Array<Product>();
        group.groupMemberships = [];
        group.title = "";
        group.description = "";
        group.imageUrl = "";
        return group;
    }
}
