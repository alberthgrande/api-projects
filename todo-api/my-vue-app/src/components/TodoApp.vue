<template>
  <div class="container">
    <h1>Task List</h1>
    <div class="row g-3">
      <div class="col-auto">
        <label for="newTasks" class="visually-hidden">Add Task</label>
        <input
          class="form-control"
          v-model="newTasks"
          placeholder="Add a task"
        />
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="addTask">Add Task</button>
      </div>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in tasks" :key="task._id">
          <td>
            <span>{{ task.title }}</span>
          </td>
          <td class="text-left">
            <button class="btn btn-danger btn-sm" @click="deleteTask(task._id)">
              Delete
            </button>
            <button
              class="btn btn-success btn-sm ms-2"
              @click="toggleCompletion(task._id, task.completed)"
            >
              {{ task.completed ? "Undo" : "Complete" }}
            </button>
            <!-- Button trigger modal -->
            <button
              type="button"
              class="btn btn-primary btn-sm ms-2"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              @click="openEditModal(task._id, task.title)"
            >
              Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div
      class="modal fade"
      id="exampleModal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Tasks</h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              :disabled="!editTaskTitle"
            ></button>
          </div>
          <div class="modal-body">
            <div class="col-auto">
              <label for="editTask" class="visually-hidden">Edit Task</label>
              <input
                class="form-control"
                v-model="editTaskTitle"
                placeholder="Edit Task"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="!editTaskTitle"
            >
              Close
            </button>
            <button
              type="button"
              class="btn btn-primary"
              @click="saveEditTask"
              :data-bs-dismiss="editTaskTitle ? 'modal' : ''"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tasks: [],
      newTasks: "",
      editTaskId: null,
      editTaskTitle: "",
    };
  },
  created() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      try {
        const response = await axios.get("http://localhost:3000/tasks");
        this.tasks = response.data;
        console.log(this.tasks);
      } catch (error) {
        console.error(error);
      }
    },

    async addTask() {
      if (!this.newTasks) return;

      try {
        const response = await axios.post("http://localhost:3000/tasks", {
          title: this.newTasks,
        });
        this.tasks.push(response.data);
        this.newTasks = "";
      } catch (error) {
        console.error(error);
      }
    },

    async deleteTask(id) {
      try {
        await axios.delete(`http://localhost:3000/tasks/${id}`);
        this.tasks = this.tasks.filter((task) => task._id !== id);
      } catch (error) {
        console.error(error);
      }
    },

    async toggleCompletion(id, currentStatus) {
      try {
        const response = await axios.put(`http://localhost:3000/tasks/${id}`, {
          completed: !currentStatus,
        });

        const updatedTask = response.data;
        const index = this.tasks.findIndex((task) => task._id === id);
        this.tasks.splice(index, 1, updatedTask);
      } catch (error) {
        console.error(error);
      }
    },

    openEditModal(id, title) {
      this.editTaskId = id;
      this.editTaskTitle = title;
    },

    async saveEditTask() {
      if (!this.editTaskTitle) return;

      try {
        const response = await axios.put(
          `http://localhost:3000/tasks/${this.editTaskId}`,
          {
            title: this.editTaskTitle,
          }
        );

        const updatedTask = response.data;
        const index = this.tasks.findIndex(
          (task) => task._id === this.editTaskId
        );
        this.tasks.splice(index, 1, updatedTask);

        this.editTaskId = null;
        this.editTaskTitle = "";
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<style scoped></style>
