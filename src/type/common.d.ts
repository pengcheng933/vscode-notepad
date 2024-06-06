export type workspaceObj = {
    [key:string]: CommentRange[] | undefined
}
interface CommentRange {
    startLine: number;
    endLine: number;
    note: string
  }
//   const specialCommentsKey = ['log','test','todo']
  interface SpecialComments {
    [key: string]: CommentRange[];
  }
  interface DeleteLinesInFileParams {
    annotationType: string,
    filePath: string;
    startLine: number;
    endLine: number;
}
interface Arg{
    filePath: string,
    startLine: number,
    endLine: number,
    annotationType:string,
    msg: string
  }
  interface WorkspaceDate {
        [key:string]:{
          [key:string]: Array<{
            startLine: number,
            endLine: number
          }>
        }
  }