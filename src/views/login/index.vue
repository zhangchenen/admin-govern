<template>
  <main class="login-page">
    <div class="login-orbit login-orbit--top" aria-hidden="true"></div>
    <div class="login-orbit login-orbit--bottom" aria-hidden="true"></div>

    <section class="login-card" aria-labelledby="login-title">
      <div class="login-brand">
        <span class="login-brand__dot" aria-hidden="true"></span>
        <span>ADMIN CONSOLE</span>
      </div>

      <header class="login-heading">
        <h1 id="login-title">欢迎登录</h1>
        <p>请输入账号信息，进入管理后台</p>
      </header>

      <el-form
        ref="formRef"
        class="login-form"
        :model="form"
        :rules="rules"
        label-position="top"
        @submit.prevent
      >
        <el-form-item label="账号" prop="name">
          <el-input
            v-model="form.name"
            :prefix-icon="User"
            placeholder="请输入账号"
            autocomplete="username"
            size="large"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            :prefix-icon="Lock"
            placeholder="请输入密码"
            autocomplete="current-password"
            type="password"
            show-password
            size="large"
            @keyup.enter="handleSubmit"
          />
        </el-form-item>

        <el-button class="login-submit" type="primary" size="large" @click="handleSubmit">
          登 录
        </el-button>
      </el-form>

      <p class="login-caption">安全登录 · 请勿向他人透露账号密码</p>
    </section>

    <p class="login-footer">MOOC 管理系统</p>
  </main>
</template>

<script setup lang="ts">
defineOptions({
  name: 'LoginPage',
})

import { reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()
const form = reactive({ name: '', password: '' })
const rules: FormRules = {
  name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
}

const handleSubmit = () => {
  if (!formRef.value) return

  formRef.value.validate((valid) => {
    if (valid) ElMessage.info('登录接口尚未接入')
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
    radial-gradient(ellipse at 15% 12%, rgb(219 234 254 / 72%), transparent 34%),
    radial-gradient(ellipse at 88% 82%, rgb(224 242 254 / 78%), transparent 32%),
    linear-gradient(135deg, #f8fbff 0%, #eff6ff 100%);
}

.login-orbit {
  position: absolute;
  z-index: -1;
  border: 1px solid rgb(96 165 250 / 16%);
  border-radius: 50%;
  pointer-events: none;

  &::before,
  &::after {
    position: absolute;
    border: 1px solid rgb(96 165 250 / 12%);
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
  border: 1px solid rgb(191 219 254 / 72%);
  border-radius: 20px;
  background: var(--app-surface);
  box-shadow:
    0 28px 72px rgb(30 64 175 / 10%),
    0 4px 14px rgb(15 23 42 / 4%);
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 22px;
  color: var(--app-primary);
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
    color: #334155;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }

  :deep(.el-input__wrapper) {
    min-height: 48px;
    padding: 1px 14px;
    border-radius: 10px;
    background: #fff;
    box-shadow: 0 0 0 1px var(--app-border) inset;
    transition:
      box-shadow 160ms ease,
      background-color 160ms ease;
  }

  :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px #93c5fd inset;
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
    color: #94a3b8;
  }

  :deep(.el-input__prefix-inner > .el-icon),
  :deep(.el-input__suffix-inner > .el-icon) {
    color: #94a3b8;
  }
}

.login-submit {
  width: 100%;
  height: 48px;
  margin-top: 4px;
  border: 0;
  border-radius: 10px;
  background: var(--app-primary);
  box-shadow: 0 8px 18px rgb(37 99 235 / 18%);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.12em;
  transition:
    background-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;

  &:hover {
    background: var(--app-primary-hover);
    box-shadow: 0 10px 22px rgb(37 99 235 / 24%);
  }

  &:active {
    background: var(--app-primary-active);
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 3px solid var(--app-focus);
    outline-offset: 3px;
  }
}

.login-caption {
  margin-top: 22px;
  color: #94a3b8;
  font-size: 12px;
  line-height: 1.5;
  text-align: center;
}

.login-footer {
  margin-top: 24px;
  color: #94a3b8;
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
