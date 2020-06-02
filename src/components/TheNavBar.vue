<template>
  <header class="header" id="header" v-click-outside="CloseMobileNav" v-handle-scroll="CloseMobileNav">
    <router-link :to="{ name: 'Home'}" class="logo">
      <img src="@/assets/img/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger" @click="mobileNavOpen = !mobileNavOpen">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar" :class="{'navbar-open': mobileNavOpen}">
      <ul v-if="user">
        <li class="navbar-user" v-click-outside="CloseUserDropdown">
          <a @click.prevent="userDropDown = !userDropDown">
            <img
              class="avatar-small"
              :src="user.avatar"
              alt
            />
            <span>
              {{user.name}}
              <img class="icon-profile" src="@/assets/img/arrow-profile.svg" alt />
            </span>
          </a>

          <!-- dropdown menu -->
          <!-- add class "active-drop" to show the dropdown -->
          <div id="user-dropdown" :class="{'active-drop' : userDropDown}">
            <div class="triangle-drop"></div>
            <ul class="dropdown-menu">
              <li class="dropdown-menu-item">
                <router-link :to="{name: 'Profile'}">View profile</router-link>
              </li>
              <li class="dropdown-menu-item">
                 <a @click.prevent="$store.dispatch('auth/signOut')">Logout</a>
              </li>
            </ul>
          </div>
        </li>
        <li class="dropdown-menu-item mobile-only">
          <router-link :to="{name: 'Profile'}">View profile</router-link>
        </li>
        <li class="dropdown-menu-item mobile-only">
            <a @click.prevent="$store.dispatch('auth/signOut')">Logout</a>
        </li>
      </ul>
      <ul v-else>
        <li class="navbar-item">
          <router-link :to="{name: 'Login'}">Login</router-link>
          
        </li>
        <li class="navbar-item">
          <router-link :to="{name: 'Register'}">Register</router-link>
        </li>
      </ul>
      <!-- <ul v-else>
        <li class="navbar-item mobile-only">
          <a href="profile.html">My Profile</a>
        </li>
        <li class="navbar-item mobile-only">
          <a href="#">Logout</a>
        </li>
      </ul> -->
    </nav>
  </header>
</template>

<script>
import {mapGetters} from 'vuex'
import clickOutside from '@/directives/click-outside'
import handleScroll from '@/directives/handle-scroll'
export default {
  directives: {
    clickOutside,
    handleScroll
  },
  computed: {
    ...mapGetters({
      'user': 'auth/authUser'
    })
  },
  data () {
    return {
      userDropDown: false,
      mobileNavOpen: false
    }
  },
  methods: {
    CloseUserDropdown () {
      this.userDropDown = false
    },
    CloseMobileNav () {
      this.mobileNavOpen = false
    }
  }
}
</script>

<style>
</style>