<template>
  <header class="header" id="header">
    <router-link :to="{ name: 'Home'}" class="logo">
      <img src="@/assets/img/vueschool-logo.svg" />
    </router-link>

    <div class="btn-hamburger">
      <!-- use .btn-humburger-active to open the menu -->
      <div class="top bar"></div>
      <div class="middle bar"></div>
      <div class="bottom bar"></div>
    </div>

    <!-- use .navbar-open to open nav -->
    <nav class="navbar">
      <ul v-if="user">
        <li class="navbar-user">
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
export default {
  computed: {
    ...mapGetters({
      'user': 'auth/authUser'
    })
  },
  data () {
    return {
      userDropDown: false
    }
  }
}
</script>

<style>
</style>