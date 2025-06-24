import * as fairygui from "fairygui-cc";
import UI from "./UIController";
/** 全局 fgui 命名空间声明 - 映射 fairygui-cc 模块 */

declare global {
    interface IViewInfo {
        name: string;
        url?: string;
        bundleName: string;
        packages: string[];
        objectName: string;
        viewType: UI.ViewType;
    }
    namespace fgui {
        // 从 fairygui-cc 模块导入所有类型
        export import GGroup = fairygui.GGroup;
        export import GObject = fairygui.GObject;
        export import GGraph = fairygui.GGraph;
        export import GImage = fairygui.GImage;
        export import GMovieClip = fairygui.GMovieClip;
        export import GRoot = fairygui.GRoot;
        export import GTextField = fairygui.GTextField;
        export import GRichTextField = fairygui.GRichTextField;
        export import GTextInput = fairygui.GTextInput;
        export import GLoader = fairygui.GLoader;
        export import GLoader3D = fairygui.GLoader3D;
        export import GComponent = fairygui.GComponent;
        export import GLabel = fairygui.GLabel;
        export import GButton = fairygui.GButton;
        export import GComboBox = fairygui.GComboBox;
        export import GSlider = fairygui.GSlider;
        export import GProgressBar = fairygui.GProgressBar;
        export import GScrollBar = fairygui.GScrollBar;
        export import GList = fairygui.GList;
        export import GTree = fairygui.GTree;
        export import GTreeNode = fairygui.GTreeNode;
        export import Window = fairygui.Window;
        export import PopupMenu = fairygui.PopupMenu;
        export import Controller = fairygui.Controller;
        export import Transition = fairygui.Transition;
        export import ScrollPane = fairygui.ScrollPane;
        export import UIPackage = fairygui.UIPackage;
        export import PackageItem = fairygui.PackageItem;
        export import GObjectPool = fairygui.GObjectPool;
        export import UIObjectFactory = fairygui.UIObjectFactory;
        export import UIConfig = fairygui.UIConfig;
        export import DragDropManager = fairygui.DragDropManager;
        export import AsyncOperation = fairygui.AsyncOperation;
        export import TranslationHelper = fairygui.TranslationHelper;

        // 枚举类型
        export import ButtonMode = fairygui.ButtonMode;
        export import AutoSizeType = fairygui.AutoSizeType;
        export import AlignType = fairygui.AlignType;
        export import VertAlignType = fairygui.VertAlignType;
        export import LoaderFillType = fairygui.LoaderFillType;
        export import ListLayoutType = fairygui.ListLayoutType;
        export import ListSelectionMode = fairygui.ListSelectionMode;
        export import OverflowType = fairygui.OverflowType;
        export import PackageItemType = fairygui.PackageItemType;
        export import ObjectType = fairygui.ObjectType;
        export import ProgressTitleType = fairygui.ProgressTitleType;
        export import ScrollBarDisplayType = fairygui.ScrollBarDisplayType;
        export import ScrollType = fairygui.ScrollType;
        export import FlipType = fairygui.FlipType;
        export import ChildrenRenderOrder = fairygui.ChildrenRenderOrder;
        export import GroupLayoutType = fairygui.GroupLayoutType;
        export import PopupDirection = fairygui.PopupDirection;
        export import RelationType = fairygui.RelationType;
    }
}
