<template>
    <div class="control user-search-wrapper"><!--@focusout="disableSearch" -->
        <input v-model="userSearch" class="input" type="text" :placeholder="placeholder" :name="name" v-validate="(validation== true)?'required':'required:false'"  :data-vv-scope="scope"
               @input="enableSearch"
               @keyup.down="nextItem"
               @keyup.up="prevItem"
               @keyup.enter="confirmUserSearch"
               @focusout="disableSearch">

        <transition name="fade">
            <div v-show="isSearchEnabled && filteredUsers.length > 0 && userSearch.length> 0"
                 class="user-search-text-field">
                <div @click="setUserSearch(user)"
                     v-bind:class="{'is-active':index===currentItem}"
                     class="user-search-item"
                     v-for="(user,index) in filteredUsers" v-bind:key="index">
                    <b>{{user.slice(0,userSearch.length)}}</b>{{user.slice(userSearch.length,user.length)}}
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
  import Component from "vue-class-component";
  import Vue from "vue";
  import Group from "@/stores/models/groups/Group";
  import { Action, Getter } from "vuex-class";
  import { Emit, Prop } from "vue-property-decorator";

  @Component({})
  export default class UserSearchInput extends Vue {

    @Prop(Boolean)
    private validation: boolean;

    @Prop(String)
    private scope: string;

    @Prop(String)
    private name: string;

    @Prop(String)
    private placeholder: string;

    private userSearch: string = "";

    private users: string[] = [];
    private isSearchEnabled: boolean = false;
    private currentItem: number = 0;

    get group() {
      return this.getGroup;
    }

    get filteredUsers() {
      return this.users.filter(it => it.startsWith(this.userSearch));
    }

    @Getter("getCurrentGroup")
    private getGroup!: Group;

    @Action("performFetchUserNames")
    private performFetchUserNames!: Function;

    @Emit("update")
    update() {
      return this.userSearch;
    }

    async created() {
      this.$validator = this.$parent.$validator;
      this.users = await this.performFetchUserNames();
    }


    public setUserSearch(name: string) {
      this.userSearch = name;
      this.disableSearch();
    }

    enableSearch() {
      this.isSearchEnabled = true;
      this.currentItem = 0;
    }

    disableSearch() {
      this.isSearchEnabled = false;
      this.update();
    }

    nextItem() {
      if (this.currentItem === this.filteredUsers.length - 1) {
        this.currentItem = 0;
      } else {
        this.currentItem++;
      }
    }

    prevItem() {
      if (this.currentItem === 0) {
        this.currentItem = this.filteredUsers.length - 1;
      } else {
        this.currentItem--;
      }
    }

    confirmUserSearch() {
      this.userSearch = this.filteredUsers[this.currentItem];
      this.disableSearch();
      this.update();
    }

  }
</script>

<style scoped lang="scss">
    .user-search-wrapper {
        position: relative;
    }

    .user-search-text-field {
        z-index: 1001;
        position: absolute;
        margin-top: 1px;
        width: 100%;
        background-color: $darker-blue;
        border-radius: 6px 6px 6px 6px;
    }

    .user-search-item {
        padding: 12px;
        cursor: pointer;
        color: $light;

        &:hover {
            background-color: $dark;
            color: $light;
        }

        &:last-of-type {
            border-radius: 0 0 6px 6px;
        }

        &:first-of-type {
            border-radius: 6px 6px 0 0;
        }

        &.is-active {
            background-color: $primary;
            color: $dark;

            &:only-of-type {
                border-radius: 6px 6px 6px 6px;
            }
        }

    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.3s
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0
    }

</style>