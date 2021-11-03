import { AxiosResponse } from "axios";

import { HTTP } from "@/axios";
import GroupTO from "@/services/group/types/GroupTO";
import Group from "@/stores/models/groups/Group";

/**
 * static http service for group related logic
 */
export default class GroupService {
  /**
   * Get all group informations for the current user.
   * @returns {Promise<GroupInformation[]>}
   */
  static async getGroupsForUser(): Promise<Group[]> {
    let response: AxiosResponse<GroupTO[]> = await HTTP().get("groups/util");
    return Group.fromTOList(response.data);
  }

  /**
   * Get a single group information for the current user by group title.
   * @param {string} groupTitle
   * @returns {Promise<GroupInformation>}
   */
  static async getGroupForUserByTitle(groupTitle: string): Promise<Group> {
    const response: AxiosResponse<Group> = await HTTP().get("groups", {
      params: {
        groupTitle: groupTitle
      }
    });
    return Group.fromTO(response.data);
  }

  /**
   * Create a new group
   * @param {string} title
   * @param {string} description
   * @returns {Promise<Group>}
   */
  static async createGroup(
    title: string,
    description: string,
    imageUrl: string
  ): Promise<Group> {
    let response: AxiosResponse<GroupTO> = await HTTP().post("groups", {
      title: title,
      description: description,
      imageUrl: imageUrl
    });
    return Group.fromTO(response.data);
  }

  /**
   * Delete a group with the given name, if the current user is owner of this group
   * @param {string} name
   * @returns {Promise<Group>}
   */
  static async deleteGroup(name: string): Promise<Group> {
    const response: AxiosResponse<GroupTO> = await HTTP().delete(
      "groups/delete",
      {
        params: { name }
      }
    );

    return Group.fromTO(response.data);
  }
}
