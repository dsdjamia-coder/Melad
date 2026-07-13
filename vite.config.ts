import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          login: path.resolve(__dirname, 'login.html'),
          forgotPassword: path.resolve(__dirname, 'forgot-password.html'),
          activateAccount: path.resolve(__dirname, 'activate-account.html'),
          selectFest: path.resolve(__dirname, 'select-fest.html'),
          unauthorized: path.resolve(__dirname, 'unauthorized.html'),
          adminDashboard: path.resolve(__dirname, 'admin/dashboard.html'),
          adminUsers: path.resolve(__dirname, 'admin/users.html'),
          adminInvitations: path.resolve(__dirname, 'admin/user-invitations.html'),
          judgeDashboard: path.resolve(__dirname, 'judge/dashboard.html'),
          teamDashboard: path.resolve(__dirname, 'team/dashboard.html'),
        }
      }
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
