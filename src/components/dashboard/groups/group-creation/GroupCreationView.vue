<template>
    <section>
        <!--START HERO CONTAINER -->
        <div class="hero has-background-dark-blue has-tech-image is-bold">
            <div class="hero-body">
                <div class="container">
                    <!-- GROUP CREATION TITLE-->
                    <h1 class="title has-text-white-ter">Create a new Group</h1>
                    <!-- GROUP CREATION SUBTITLE-->
                    <h2
                            class="subtitle has-text-white-ter"
                    >Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto, pariatur, voluptatem.</h2>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="container">
                <div class="columns">
                    <div class="column is-4">
                        <h3 class="title">New group</h3>
                        <br>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa ea maiores nostrum nulla
                            reprehenderit, ullam!
                        </p>
                        <br>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing.</p>
                    </div>
                    <div class="column is-5">
                        <div class="box">
                            <!-- FIELD FOR GROUP NAME-->
                            <div class="field">
                                <div class="control">
                                    <label class="label">Group name</label>
                                    <input
                                            v-model="groupTitle"
                                            v-validate="'required|min:3|max:32'"
                                            type="text"
                                            name="title"
                                            class="input"
                                            placeholder="Group name..."
                                            ref="groupTitle"
                                            @keyup.enter="createGroup()">
                                    <p class="content has-text-danger">{{ errors.first('title') }}</p>
                                </div>
                            </div>
                            <!-- FIELD FOR GROUP DESCRIPTION-->
                            <div class="field">
                                <div class="control">
                                    <label class="label">Group description (optional)</label>
                                    <textarea
                                            v-model="groupDescription"
                                            class="textarea"
                                            placeholder="Group description..."
                                    ></textarea>
                                </div>
                            </div>

                            <!-- Button group for handling group creation or going back-->
                            <div class="buttons">
                                <button class="button is-primary" @click="createGroup()">Create group</button>
                                <button class="button" @click="$router.go(-1)">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </section>
</template>

<script lang="ts">
    import Component from "vue-class-component";
    import Vue from "vue";
    import Group from "../../../../stores/models/groups/Group";
    import {Action} from "vuex-class";
    import {ErrorService} from "@/services/errors/ErrorService";
    import ImageService from "@/services/images/ImageService";

    /**
     * Component for creating groups.
     * @author Felix Rottler.
     */
    @Component({})
    export default class GroupCreationView extends Vue {
        /*data properties needed for group creation*/
        private groupTitle: string = "";
        private groupDescription: string = "";


        /*store action */
        @Action("performCreateGroup")
        private performCreateGroup!: Function;


        created() {
            // Creates a client

        }

        mounted() {
            this.focusGroupNameInput();
        }

        /**
         * Create a new group after title and description are validated.
         * Links to detail view after the group was created or notifies
         * the error that occurred during creation.
         */
        async createGroup() {
            const imageURL = await ImageService.uploadImage();

            this.$validator.validate().then((valid: boolean) => {
                if (valid) {
                    this.performCreateGroup({
                        title: this.groupTitle,
                        description: this.groupDescription,
                        imageUrl: imageURL
                    }).then((group: Group) => {
                        this.$router.push({
                            name: "GroupDetailDefaultView",
                            params: {groupTitle: group.title}
                        });
                    }).catch((error) => {
                        this.$notify({
                            group: "global",
                            title: "Error!",
                            type: "error",
                            text: ErrorService.buildMessage(error)
                        });
                    });
                }
            });
        }

        private focusGroupNameInput() {
            (this.$refs.groupTitle as HTMLInputElement).focus();
        }
    }
</script>

<style scoped lang="scss">
</style>
