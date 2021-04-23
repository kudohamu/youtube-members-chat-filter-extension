import { Configuration } from "webpack";
import webpackMerge from "webpack-merge";
import { common } from "./webpack.common.config";

const prod: Configuration = {
  mode: "production"
};

const config = webpackMerge(common, prod);

export default [config];
