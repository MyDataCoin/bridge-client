<template>
  <div class="bg-light min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <span class="clearfix">
            <h1 class="float-start display-3 me-4">403</h1>
            <h4 class="pt-3">Нет доступа!</h4>
            <p class="text-medium-emphasis float-start">
              У вас нет прав для просмотра данной страницы. Обратитесь к
              администратору.
            </p>
          </span>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'Page401',
}
</script>
