import axios from "axios";

const api = axios.create({
  baseURL: "https://danbee.ai/chatflow/",
  headers: { "Content-Type": "application/json;charset=UTF-8" },
});

export const DanbeeApi = {
  getWelcome: () =>
    api.post("/welcome.do", {
      chatbot_id: "eb75e679-21a7-4c67-ac48-f7ee22bcb9fc",
    }),
  getAnswer: ( req, intent_id, param_id, parameters, session_id, node_id, ins_id, chatflow_id, ) =>
    api.post("/engine.do", {
      chatbot_id: "eb75e679-21a7-4c67-ac48-f7ee22bcb9fc",
      intent_id,
      param_id,
      session_id,
      node_id,
      ins_id,
      chatflow_id,
      input_sentence: req,
    }),
  //.then(res=>(console.log(res))),
};
