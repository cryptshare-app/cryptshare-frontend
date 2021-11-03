import Vue from "vue";
import Vuex from "vuex";
import GroupService from "@/services/group/GroupService";
import Group from "@/stores/models/groups/Group";
import {BusinessError} from "@/stores/models/BusinessError";
import GroupMembershipService from "@/services/group/GroupMembershipService";
import GroupMembership from "@/stores/models/groups/GroupMembership";

import {AxiosError} from "axios";
import ProductService from "@/services/product/ProductService";
import Product from "@/stores/models/Product";
import Payment from "../models/Payment";
import PaymentTO from "@/services/payments/types/PaymentTO";
import IotaPaymentService from "@/services/iota/IotaPaymentService";
import {reject} from "q";

Vue.use(Vuex);
const iotaPaymentService = new IotaPaymentService();
/**
 * Store for handling group related logic like for example
 * getting group information for a user by a group title.
 * No state is used, since vuex store is no persisted through page load.
 *
 */
export const GroupStore = {
    state: {
        currentGroup: Group.fromTemplate()
    },
    mutations: {
        SET_GROUP(state: any, currentGroup: Group) {
            state.currentGroup = currentGroup;
        },
        UPDATE_AUTO_PAY_IN_GROUP(state: any, autoPay: boolean) {
            state.currentGroup.userMembership.autoPay = autoPay;
        },
        ADD_PRODUCT_IN_GROUP(state: any, product: Product) {
            state.currentGroup.products.push(product);
        },
        UPDATE_PRODUCT_IN_GROUP(state: any, productToUpdate: Product) {
            state.currentGroup.products = state.currentGroup.products.map(
                (product: Product) => {
                    if (product.id === productToUpdate.id) {
                        product = productToUpdate;
                    }
                    return product;
                }
            );
        },
        REMOVE_PRODUCT_IN_GROUP(state: any, productToDelete: Product) {
            state.currentGroup.products = state.currentGroup.products.filter(
                (product: Product) => {
                    return product.productName !== productToDelete.productName;
                }
            );
        },
        ADD_PAYMENT_IN_GROUP(state: any, paymentToAdd: Payment) {
            state.currentGroup.payments.push(paymentToAdd);
        },
        UPDATE_PAYMENT_IN_GROUP(state: any, paymentToUpdate: Payment) {
            state.currentGroup.payments = state.currentGroup.payments.map(
                (payment: Payment) => {
                    if (payment.id === paymentToUpdate.id) {
                        console.log(paymentToUpdate);
                        payment = paymentToUpdate;
                    }
                    return payment;
                }
            );
        },
        ADD_MEMBERSHIP_IN_GROUP(state: any, membership: GroupMembership) {
            state.currentGroup.groupMemberships.push(membership);
        },
        UPDATE_MEMBERSHIP_IN_GROUP(state: any, membershipToUpdate: GroupMembership) {
            state.currentGroup.groupMemberships = state.currentGroup.groupMemberships.map(
                (membership: GroupMembership) => {
                    if (membership.id === membershipToUpdate.id) {
                        membership = membershipToUpdate;
                    }
                    return membership;
                }
            );
        }
    },
    getters: {
        getCurrentGroup: (state: any) => {
            return state.currentGroup;
        }
    },
    actions: {

        /**
         updates the given group Membership
         *
         */
        updateGroupMembership({commit}, groupMembership: GroupMembership) {
            return new Promise((resolve, reject) => {
                GroupMembershipService.update(groupMembership)
                    .then((groupMembership: GroupMembership) => {
                        commit("UPDATE_MEMBERSHIP_IN_GROUP", groupMembership);
                        resolve(groupMembership);
                    })
                    .catch((error: AxiosError) => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },

        /**
         *  Get all group informations the currently logged in user participates in.
         * @param {any} commit
         * @returns {Promise} a Promise that resolves the group information if no error occurs.
         */
        getGroupsForUser({commit}) {
            return new Promise((resolve, reject) => {
                GroupService.getGroupsForUser()
                    .then((groups: Group[]) => {
                        resolve(groups);
                    })
                    .catch((error: AxiosError) => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Create a group from the given parameters.
         * @param {any} commit
         * @param {any} title the title of the group
         * @param {any} description the description of the group
         * @param imageUrl
         * @returns {Promise} a promise that resolves the newly created group.
         */
        performCreateGroup({commit}, {title, description, imageUrl}) {
            return new Promise((resolve, reject) => {
                GroupService.createGroup(title, description, imageUrl)
                    .then((group: Group) => {
                        commit("SET_GROUP", group);
                        resolve(group);
                    })
                    .catch(err => {
                        reject(BusinessError.fromResponse(err));
                    });
            });
        },
        /**
         * Delete a existing group by its title and works if the user is owner of the group.
         * @param {any} commit
         * @param {string} title the title of the group to delete.
         * @returns {Promise}
         */
        performDeleteGroup({commit}, title: string) {
            return new Promise((resolve, reject) => {
                GroupService.deleteGroup(title)
                    .then((deletedGroup: Group) => {
                        resolve(deletedGroup);
                    })
                    .catch(err => {
                        reject(BusinessError.fromResponse(err));
                    });
            });
        },
        /**
         * Get group information for a group identified by its title for the currently logged in user.
         * @param {any} commit
         * @param {string} title the title of the group.
         * @returns {Promise} a promise that resolves the group information
         */
        performGetGroupForUserByTitle({commit}, title: string) {
            return new Promise((resolve, reject) => {
                GroupService.getGroupForUserByTitle(title)
                    .then((group: Group) => {
                        commit("SET_GROUP", group);
                        resolve(group);
                    })
                    .catch(err => {
                        reject(BusinessError.fromResponse(err));
                    });
            });
        },
        /**
         * Get all group memberships of a group identified by its title.
         * @param {any} commit
         * @param {string} groupTitle the title of the group.
         * @returns {Promise} a promise that resolves to an array of group memberships.
         */
        performGetAllGroupMembershipsByTitle({commit}, groupTitle: string) {
            return new Promise((resolve, reject) => {
                GroupMembershipService.getAllGroupMembershipsForGroup(groupTitle)
                    .then((groupMemberships: Array<GroupMembership>) => {
                        resolve(groupMemberships);
                    })
                    .catch(err => {
                        reject(BusinessError.fromResponse(err));
                    });
            });
        },
        /**
         * Invites a user (given by its name) with the given role to a group identified by its title.
         * This will only work if the user that performs this request is the owner of the group.
         * @param {any} commit
         * @param {any} groupTitle the title of the group the other user will be invited to.
         * @param {any} otherUsername the name of the user that will be invited.
         * @param {any} role the membership role of the other user in this group.
         * @returns {Promise}
         */
        performInviteUserToGroup({commit}, {groupTitle, otherUsername, role}) {
            return new Promise((resolve, reject) => {
                GroupMembershipService.inviteUserToGroup(
                    groupTitle, otherUsername, role)
                    .then((groupMembership: GroupMembership) => {
                        commit("ADD_MEMBERSHIP_IN_GROUP", groupMembership);
                        resolve(groupMembership);
                    })
                    .catch((error: AxiosError) => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Accepts the group invitation for the currently logged in user if the user
         * was invited to the group identified by its title.
         * @param {any} commit
         * @param {string} group the title of the group
         * @returns {Promise} a promises that resolves to the new group information for the user./
         */
        performAcceptInvitation({commit}, group: string) {
            return new Promise((resolve, reject) => {
                GroupMembershipService.acceptInvitation(group)
                    .then((group: Group) => {
                        resolve(group);
                    })
                    .catch(error => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Reject a invitation for a given group
         * @param {any} commit
         * @param {string} groupTitle
         * @returns {Promise}
         */
        performRejectInvitation({commit}, groupTitle: string) {
            return new Promise((resolve, reject) => {
                GroupMembershipService.rejectInvitation(groupTitle)
                    .then(() => {
                        resolve(true);
                    })
                    .catch(error => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        },
        /**
         * Get all products for a certain group identified by its title
         * @param {any} commit
         * @param {string} groupTitle
         * @returns {Promise}
         */
        performGetAllProductsForGroup({commit}, groupTitle: string) {
            return new Promise((resolve, reject) => {
                ProductService.getAllProductsForGroup(groupTitle)
                    .then((response: Product[]) => {
                        resolve(response);
                    })
                    .catch(err => {
                        reject(BusinessError.fromResponse(err));
                    });
            });
        },
        performLeaveGroup({commit}, groupTitle: string) {
            return new Promise((resolve, reject) => {
                GroupMembershipService.leaveGroup(groupTitle)
                    .then(() => {
                        resolve();
                    })
                    .catch(err => {
                        reject(BusinessError.fromResponse(err));
                    });
            });
        },
        /**
         * Adds a new product to the db
         * @param commit
         * @param product the newly created product
         */
        performAddProductInGroup({commit}, product: Product) {
            return new Promise((resolve, reject) => {
                ProductService.createProduct(product)
                    .then((product: Product) => {
                        commit("ADD_PRODUCT_IN_GROUP", product);
                        resolve(product);
                    })
                    .catch((err) => {
                        reject(BusinessError.fromResponse(err));
                    });
            });

        },
        performConfirmPayment({commit}, paymentTo: PaymentTO) {
            return new Promise((resolve, reject) => {
                iotaPaymentService.confirmPayment(paymentTo)
                    .then((payment: Payment) => {
                        commit("UPDATE_PAYMENT_IN_GROUP", payment);
                        resolve(payment);
                    })
                    .catch(error => {
                        reject(BusinessError.fromResponse(error));
                    });
            });
        }
    }
};
