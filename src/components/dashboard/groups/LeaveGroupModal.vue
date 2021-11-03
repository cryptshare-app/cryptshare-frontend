<template>
  <div class="modal is-active">
    <div class="modal-background" @click="onCloseModal"></div>
    <div class="modal-content">
      <!-- Any other Bulma elements you want -->
      <div class="box">
        <div class="hero">
          <div class="hero-body">
            <p class="subtitle">Do you really want to leave this group?</p>
            <small>This will be only possible if you have paid all your open payments.</small>
          </div>
        </div>
        <div class="columns">
          <div class="column">
            <div class="field is-grouped is-pulled-right">
              <div class="control">
                <button class="button is-primary is-outlined" @click="onLeaveGroup">Leave</button>
              </div>
              <div class="control">
                <button class="button" @click="onCloseModal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="onCloseModal"></button>
  </div>
</template>


<script lang="ts">
import Component from "vue-class-component";
import Vue from "vue";
import { Emit, Prop } from "vue-property-decorator";
import { Action, Getter } from "vuex-class";

@Component({
  name: "leave-group-modal"
})
export default class LeaveGroupModal extends Vue {
  @Emit("close")
  private onCloseModal() {}

  @Emit("leave")
  private onLeaveGroup() {}
}
</script>

<style scoped lang="scss">
.product-item {
  margin-top: 15px;
}
</style>

