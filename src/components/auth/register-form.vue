<template>
  <b-container class="mt-5">
    <b-row align-h="center">
      <b-col sm="8" md="6" lg="4">
        <b-card border-variant="primary">
          <b-card-header>
            <img
              src="@/assets/logo-kawak.svg"
              alt="logo kawak"
              style="max-width: 40%"
            />
            <h2>Crear cuenta en calendario kawak</h2>
          </b-card-header>

          <b-card-body>
            <b-form @submit.prevent="agregarUsuario">
              <b-alert
                v-model="showDismissibleAlert"
                :variant="variant"
                dismissible
              >
                {{ message }}
              </b-alert>
              <b-form-group label="Correo electrónico" label-for="email">
                <b-form-input
                  v-model="form.email"
                  type="email"
                  id="email"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Nombre" label-for="name">
                <b-form-input
                  v-model="form.name"
                  type="text"
                  id="name"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group label="Contraseña" label-for="password">
                <b-form-input
                  v-model="form.password"
                  type="password"
                  id="password"
                  required
                ></b-form-input>
              </b-form-group>

              <b-button :variant="getButtonVariant()" type="submit" class="mt-3"
                >Registrarse</b-button
              >
            </b-form>
          </b-card-body>

          <b-card-footer class="text-center">
            <router-link to="/login-form"
              >Ya tengo una cuenta<br />iniciar sesión</router-link
            >
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { setUserDontExist } from "@/config/firebase";

export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        password: "",
      },
      showDismissibleAlert: false,
      variant: "",
      message: "",
    };
  },
  methods: {
    getButtonVariant() {
      return this.form.name.trim() === "" ||
        this.form.email.trim() === "" ||
        this.form.password.trim() === ""
        ? "outline-primary"
        : "primary";
    },
    async agregarUsuario() {
      try {
        // Crear documento de usuario solo si no existe
        if (
          await setUserDontExist(
            this.form.email,
            this.form.name,
            this.form.password
          )
        ) {
          // El documento ya existe
          this.showDismissibleAlert = true;
          this.variant = "warning";
          this.message = "Este email ya se ah creado";
        } else {
          // El documento no existe, entonces se crea
          this.$router.push("/login-form");
        }
      } catch (error) {
        // Otro tipo de error
        this.showDismissibleAlert = true;
        this.variant = "danger";
        this.message =
          "Error al crear el usuario. Por favor, intenta nuevamente.";
        console.error(error);
      }
    },
  },
};
</script>
