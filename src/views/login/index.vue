<template>
  <main class="login-page" v-loading="loading" :element-loading-text="$t('msg.login.loading')">
    <div class="login-orbit login-orbit--top" aria-hidden="true"></div>
    <div class="login-orbit login-orbit--bottom" aria-hidden="true"></div>
    <section class="login-card relative" aria-labelledby="login-title">
      <div class="login-brand">
        <span class="login-brand__dot" aria-hidden="true"></span>
        <span>{{ $t('msg.login.title') }}</span>
      </div>
      <lang-select class="cursor-pointer absolute! top-[10px] right-[10px] [&_svg]:size-[30px]"></lang-select>
      <header class="login-heading">
        <h1 id="login-title">{{ $t('msg.login.subTitle') }}</h1>
        <p>{{ $t('msg.login.loginTips') }}</p>
      </header>

      <el-form
        ref="formRef"
        class="login-form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item :label="$t('msg.login.loginUser')" prop="username">
          <el-input
            v-model="form.username"
            :prefix-icon="User"
            :placeholder="$t('msg.login.loginUserPlaceholder')"
            autocomplete="username"
            size="large"
          />
        </el-form-item>

        <el-form-item :label="$t('msg.login.loginPassword')" prop="password">
          <el-input
            v-model="form.password"
            :prefix-icon="Lock"
            :placeholder="$t('msg.login.passwordPlaceholder')"
            autocomplete="current-password"
            type="password"
            show-password
            size="large"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-button class="login-submit" type="primary" size="large" @click="handleSubmit">
          {{ $t('msg.login.loginBtn') }}
        </el-button>
      </el-form>

      <p class="login-caption">{{ $t('msg.login.caption') }}</p>
    </section>

    <p class="login-footer">{{ $t('msg.login.footer') }}</p>
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoginPage',
})

import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import type { userLoginInfo } from '@/views/login/type'
import { useUserStore } from '@/stores/user'

const { t } = useI18n({ useScope: 'global' })
const router = useRouter()
const formRef = ref<FormInstance>()
const form: userLoginInfo = reactive({ username: '', password: '' })
const rules = computed<FormRules>(() => ({
  username: [{ required: true, message: t('msg.login.usernameRule'), trigger: 'blur' }],
  password: [{ required: true, message: t('msg.login.passwordRule'), trigger: 'blur' }],
}))
const loading = ref(false)
const userStore = useUserStore()
const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (!valid) return
    loading.value = true
    userStore
      .login(form)
      .then(async () => {
        loading.value = false
        ElMessage.success(t('msg.login.loginSuccess'))
        await router.replace('/')
      })
      .catch(() => {
        loading.value = false
      })
  })
}
</script>

<style lang="scss" scoped>
.login-page {
  position: relative;
  isolation: isolate;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 48px 20px 24px;
  background:
    radial-gradient(ellipse at 15% 12%, var(--app-page-glow-start), transparent 34%),
    radial-gradient(ellipse at 88% 82%, var(--app-page-glow-end), transparent 32%),
    linear-gradient(135deg, var(--app-page-highlight) 0%, var(--app-page-tint) 100%);
}

.login-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid var(--app-decoration-border);
  border-radius: 50%;
  pointer-events: none;

  &::before,
  &::after {
    position: absolute;
    border: 1px solid var(--app-decoration-border-inner);
    border-radius: 50%;
    content: '';
  }

  &::before {
    inset: 18px;
  }

  &::after {
    inset: 38px;
  }

  &--top {
    top: -226px;
    right: -148px;
    width: 470px;
    height: 470px;
  }

  &--bottom {
    bottom: -290px;
    left: -168px;
    width: 490px;
    height: 490px;
  }
}

.login-card {
  width: min(100%, 440px);
  padding: 40px 42px 30px;
  border: 1px solid var(--app-card-border);
  border-radius: 20px;
  background: var(--app-surface);
  box-shadow: var(--app-card-shadow);
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 22px;
  color: var(--app-primary-text);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;

  &__dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--app-primary);
    box-shadow: 0 0 0 5px var(--app-primary-soft);
  }
}

.login-heading {
  margin-bottom: 30px;
  text-align: center;

  h1 {
    color: var(--app-text);
    font-size: 28px;
    font-weight: 700;
    line-height: 1.35;
  }

  p {
    margin-top: 10px;
    color: var(--app-text-secondary);
    font-size: 14px;
    line-height: 1.6;
  }
}

.login-form {
  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__label) {
    height: auto;
    margin-bottom: 8px;
    color: var(--app-label-text);
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }

  :deep(.el-input__wrapper) {
    min-height: 48px;
    padding: 1px 14px;
    border-radius: 10px;
    background: var(--app-surface);
    box-shadow: 0 0 0 1px var(--app-border) inset;
    transition:
      box-shadow 160ms ease,
      background-color 160ms ease;
  }

  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--app-input-hover-border) inset;
  }

  :deep(.el-input__wrapper.is-focus) {
    box-shadow:
      0 0 0 1px var(--app-primary) inset,
      0 0 0 4px var(--app-focus);
  }

  :deep(.el-input__inner) {
    color: var(--app-text);
    font-size: 14px;
  }

  :deep(.el-input__inner::placeholder) {
    color: var(--app-placeholder);
  }

  :deep(.el-input__prefix-inner > .el-icon),
  :deep(.el-input__suffix-inner > .el-icon) {
    color: var(--app-placeholder);
  }
}

.login-submit {
  width: 100%;
  height: 48px;
  margin-top: 4px;
  border: 0;
  border-radius: 10px;
  background: var(--app-primary);
  color: var(--app-on-primary); // 自选浅色主色时使用黑字，避免登录按钮文字看不清。
  box-shadow: var(--app-button-shadow);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.12em;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover {
    background: var(--app-primary-hover);
    color: var(--app-on-primary); // 悬停时保持主色上的对比文字。
    box-shadow: var(--app-button-hover-shadow);
  }

  &:active {
    background: var(--app-primary-active);
    color: var(--app-on-primary); // 按下时也保持文字可读。
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid var(--app-focus);
    outline-offset: 3px;
  }
}

.login-caption {
  margin-top: 22px;
  color: var(--app-placeholder);
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.login-footer {
  margin-top: 24px;
  color: var(--app-placeholder);
  font-size: 12px;
  letter-spacing: 0.04em;
}

@media (max-width: 480px) {
  .login-page {
    padding: 28px 16px 20px;
  }

  .login-card {
    padding: 34px 24px 26px;
    border-radius: 18px;
  }

  .login-heading h1 {
    font-size: 26px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .login-form :deep(.el-input__wrapper),
  .login-submit {
    transition: none;
  }
}
</style>
