<template>
  <div class="user-info-container">
    <el-card class="print-actions">
      <el-button type="primary" disabled>打印（待手写）</el-button>
    </el-card>

    <el-card>
      <div id="userInfoBox" class="user-info-box">
        <h2 class="title">{{ $t('msg.userInfo.title') }}</h2>

        <div class="header">
          <el-descriptions :column="2" border>
            <el-descriptions-item :label="$t('msg.userInfo.name')">
              <span class="field-placeholder">待绑定 detailData.username</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.sex')">
              <span class="field-placeholder">待绑定 detailData.gender</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.nation')">
              <span class="field-placeholder">待绑定 detailData.nationality</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.mobile')">
              <span class="field-placeholder">待绑定 detailData.mobile</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.province')">
              <span class="field-placeholder">待绑定 detailData.province</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.date')">
              <span class="field-placeholder">待绑定并格式化 detailData.openTime</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.remark')" :span="2">
              <span class="field-placeholder">待绑定 detailData.remark</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.address')" :span="2">
              <span class="field-placeholder">待绑定 detailData.address</span>
            </el-descriptions-item>
          </el-descriptions>
          <div class="avatar-placeholder">头像字段待绑定</div>
        </div>

        <div class="body">
          <el-descriptions direction="vertical" :column="1" border>
            <el-descriptions-item :label="$t('msg.userInfo.experience')">
              <span class="field-placeholder">待绑定并遍历 detailData.experience</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.major')">
              <span class="field-placeholder">待绑定 detailData.major</span>
            </el-descriptions-item>
            <el-descriptions-item :label="$t('msg.userInfo.glory')">
              <span class="field-placeholder">待绑定 detailData.glory</span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="foot">{{ $t('msg.userInfo.foot') }}</div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserInfoView' })

// TODO: 使用路由 props 获取用户 ID，调用 getUserDetail 并准备详情数据。
// TODO: 给打印按钮绑定 v-print，并在打印配置中指向 #userInfoBox。
</script>

<style lang="scss" scoped>
.user-info-container {
  .print-actions {
    margin-bottom: 20px;
    text-align: right;
  }

  .user-info-box {
    width: min(1024px, 100%);
    margin: 0 auto;

    .title {
      margin-bottom: 18px;
      text-align: center;
    }

    .header {
      display: flex;
      align-items: stretch;

      :deep(.el-descriptions) {
        flex: 1;
      }
    }

    .avatar-placeholder {
      display: grid;
      width: 187px;
      flex: 0 0 187px;
      place-items: center;
      border: 1px solid var(--app-border);
      border-left: 0;
      color: var(--app-text-secondary);
      font-size: 13px;
      text-align: center;
    }

    .body {
      margin-top: 16px;
    }

    .field-placeholder {
      color: var(--app-text-secondary);
      font-size: 13px;
    }

    .foot {
      margin-top: 42px;
      text-align: right;
    }
  }
}

@media (max-width: 720px) {
  .user-info-container .user-info-box .header {
    flex-direction: column;

    .avatar-placeholder {
      width: 100%;
      min-height: 120px;
      flex-basis: auto;
      border-left: 1px solid var(--app-border);
    }
  }
}
</style>
