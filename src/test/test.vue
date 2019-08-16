<template>
    <div>
        <InCoder :value="'System.out.println(\'Hello, world\')'" :language="'x-java'"></InCoder>
    </div>
</template>
<script>
    import InCoder from "../components/InCoder";

    export default {
        components: {InCoder}
    }
</script>
<style scoped></style>
