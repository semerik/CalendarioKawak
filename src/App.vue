<template>
  <div id="app">
    <b-navbar
      v-if="$route.path !== '/' && $route.path !== '/register-form'"
      toggleable="lg"
      type="light"
      variant="light"
      class="pt-3 pb-3"
      sticky
    >
      <!-- Logo o imagen -->
      <b-navbar-brand class="custom-navbar-toggle">
        <img
          class="img-fluid"
          id="logo"
          src="@/assets/logo-kawak.svg"
          alt="Logo Kawak"
        />
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav-collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="'/calendar/' + this.$route.params.email"
            >Calendario</b-nav-item
          >
          <b-nav-item :to="'/notes-list/' + this.$route.params.email"
            >Notas</b-nav-item
          >
          <b-nav-item-dropdown text="Usuario">
            <b-dropdown-item @click="cerrarSesion"
              >Cerrar Sesión</b-dropdown-item
            >
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",

  methods: {
    cerrarSesion() {
      this.$router.replace({ name: "login-form" });
    },
  },
};
</script>

<style scoped>
#logo {
  margin-left: 2em;
  width: 30%;
}
</style>