<template>
  <b-container class="mt-5">
    <b-row align-h="center">
      <b-col sm="8" md="6" lg="4">
        <b-card border-variant="primary">
          <b-card-header>
            <img
              src="@/assets/logo-kawak.svg"
              alt="logo kawak"
              class="img-fluid"
            />
            <!-- Agregada la clase img-fluid -->
            <h2>Iniciar sesión en calendario kawak</h2>
          </b-card-header>

          <b-card-body>
            <b-form @submit.prevent="iniciarSesion">
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

              <b-form-group label="Contraseña" label-for="password">
                <b-form-input
                  v-model="form.password"
                  type="password"
                  id="password"
                  required
                ></b-form-input>
              </b-form-group>

              <b-button
                :variant="getButtonVariant()"
                type="submit"
                class="mt-3 btn-block"
                >Iniciar sesión</b-button
              >
              <!-- Agregada la clase btn-block -->
            </b-form>
          </b-card-body>

          <b-card-footer class="text-center">
            <router-link to="/register-form"
              >¿No tienes una cuenta?<br />Registrarse</router-link
            >
          </b-card-footer>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import { userExists, userValidatorPassword } from "@/config/firebase";

export default {
  data() {
    return {
      form: {
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
      return this.form.email.trim() === "" || this.form.password.trim() === ""
        ? "outline-primary"
        : "primary";
    },
    async iniciarSesion() {
      try {
        // Obtener documento de usuario
        // const usuarioDocRef = doc(notasRef, this.form.email);
        // const usuarioDocSnapshot = await getDoc(usuarioDocRef);

        if (await userExists(this.form.email)) {
          // El usuario existe

          if (
            await userValidatorPassword(this.form.email, this.form.password)
          ) {
            //usuario correcto
            this.$router.push({
              name: "calendar",
              params: {
                email: this.form.email,
              },
            });
          } else {
            this.showDismissibleAlert = true;
            this.variant = "warning";
            this.message = "Contraseña incorrecta";
          }
        } else {
          // El usuario no existe, el usuario no está registrado
          this.showDismissibleAlert = true;
          this.variant = "warning";
          this.message = "Correo no registrado";
        }
      } catch (error) {
        // Otro tipo de error
        this.showDismissibleAlert = true;
        this.variant = "danger";
        this.message =
          "Error al iniciar sesión. Por favor, intenta nuevamente.";
        console.error(error);
      }
    },
  },
};
</script>
